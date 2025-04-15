---
title: "Graceful Shutdown 과 ThreadPoolTaskExecutor"
excerpt: "Graceful Shutdown 과 ThreadPoolTaskExecutor에 대해 알아보자"
categories:
  - Backend
tags:
  - Backend
  - Spring Boot
  - Java
  - Concurrency
  - ThreadPool
last_modified_at: 2025-04-15T08:06:00-05:00
---

# **Graceful Shutdown**

Graceful Shutdown은 애플리케이션이 종료될 때 진행 중인 작업을 적절히 완료하고 리소스를 정리한 후 종료하는 프로세스를 말합니다. 이는 갑작스러운 종료로 인한 데이터 손실이나 불완전한 처리를 방지하기 위해 중요합니다.

## Graceful Shutdown의 중요성

1. **데이터 무결성 보장**
   - 진행 중인 트랜잭션이 완료되도록 함으로써 데이터 일관성 유지
   - 부분적으로 처리된 데이터로 인한 문제 방지
2. **리소스 정리**
   - 파일 핸들, 네트워크 연결, 데이터베이스 커넥션 등의 리소스를 적절히 해제
   - 메모리 누수 방지 및 시스템 안정성 향상
3. **사용자 경험 개선**
   - 처리 중인 사용자 요청이 갑자기 중단되지 않도록 함
   - 진행 중인 작업에 대한 적절한 응답 보장

## Graceful Shutdown 구현 과정

1. **종료 신호 감지**
   - SIGTERM, SIGINT 등의 종료 신호 캡처
   - Spring 애플리케이션에서는 ApplicationListener<ContextClosedEvent> 등을 활용
2. **새로운 요청 거부**
   - 더 이상 새로운 요청을 받지 않도록 설정
   - 로드 밸런서에서 해당 서버 제외 또는 서버 자체에서 요청 거부
3. **진행 중인 작업 완료**
   - 이미 처리 중인 요청이 완료될 때까지 대기
   - 설정된 타임아웃 시간 내에 작업 완료 시도
4. **리소스 정리**
   - 모든 작업이 완료되면 데이터베이스 연결, 파일 핸들 등 리소스 해제
   - 필요한 상태 정보 저장
5. **최종 종료**
   - 모든 정리 작업이 완료된 후 애플리케이션 프로세스 종료

## 다양한 환경에서의 Graceful Shutdown

### 웹 서버/애플리케이션 서버

- Tomcat, Jetty, Undertow 등은 자체적인 Graceful Shutdown 메커니즘 제공
- 처리 중인 요청 완료를 기다리는 설정 가능

### Spring Boot 애플리케이션

- Spring Boot 2.3부터 Graceful Shutdown 기본 지원
- `server.shutdown=graceful` 설정으로 활성화
- `spring.lifecycle.timeout-per-shutdown-phase` 속성으로 종료 타임아웃 설정

### 컨테이너 환경 (Docker, Kubernetes)

- 컨테이너 종료 시 SIGTERM 신호 전송 후 일정 시간(보통 30초) 대기
- K8s에서는 preStop 훅이나 terminationGracePeriodSeconds 설정으로 커스터마이징 가능

## 구현 시 고려사항

1. **타임아웃 설정**
   - 무한정 대기하지 않도록 적절한 타임아웃 설정 필요
   - 너무 짧으면 작업이 미완료될 수 있고, 너무 길면 종료가 지연됨
2. **종료 상태 모니터링**
   - 종료 프로세스 진행 상황 로깅
   - 문제 발생 시 디버깅 정보 제공
3. **정기적인 테스트**
   - 배포 및 롤백 과정에서 Graceful Shutdown이 제대로 동작하는지 테스트
   - 장애 시나리오에 대한 대응 방안 마련

# ThreadPoolTaskExecutor

ThreadPoolTaskExecutor는 Spring Framework에서 제공하는 쓰레드 풀 구현체로, Java의 `java.util.concurrent.ThreadPoolExecutor`를 Spring 환경에서 쉽게 사용할 수 있도록 래핑한 클래스입니다.

## ThreadPollTaskExecutor 작동 원리

![ThreadPool 구조도](/assets/images/threadpooltaskexecutor/1.png)

## ThreadPoolTaskExecutor의 주요 특징

1. **스프링 통합**
   - Spring의 TaskExecutor 인터페이스 구현체로, Spring 환경에서 사용하기 적합
   - Bean으로 등록하여 의존성 주입 가능
   - @Async 어노테이션과 함께 사용하여 비동기 처리 구현
2. **쓰레드 풀 설정 옵션**
   - **corePoolSize**: 기본적으로 유지되는 쓰레드 수
   - **maxPoolSize**: 최대 생성 가능한 쓰레드 수
   - **queueCapacity**: 작업 대기열의 크기
   - **keepAliveSeconds**: 코어 쓰레드 외 추가 쓰레드의 유지 시간
   - **threadNamePrefix**: 생성되는 쓰레드의 이름 접두사
3. **작업 처리 흐름**
   - 작업이 제출되면 먼저 코어 쓰레드를 사용
   - 모든 코어 쓰레드가 사용 중이면, 작업 큐에 작업 추가
   - 작업 큐가 가득 차면, 추가 쓰레드 생성(최대 maxPoolSize까지)
   - 모든 쓰레드가 사용 중이고 큐도 가득 찬 경우 RejectedExecutionHandler 동작
4. **모니터링 및 관리**

- 현재 활성 쓰레드 수, 완료된 작업 수 등 통계 정보 제공
- JMX를 통한 모니터링 가능

## Spring은 기본 멀티 스레드와 ThreadPoolTaskExecutor 차이

### Spring의 기본 웹 요청 처리 (서블릿 컨테이너 기반)

1. **기본 동작 방식**:
   - Spring MVC/Spring Boot 웹 애플리케이션은 기본적으로 서블릿 컨테이너(Tomcat, Jetty 등)를 사용합니다.
   - 서블릿 컨테이너는 **요청당 스레드** 모델을 사용합니다.
   - 각 HTTP 요청은 서블릿 컨테이너의 스레드 풀에서 하나의 스레드를 할당받아 처리됩니다.
2. **서블릿 컨테이너의 스레드 풀**:
   - 예: Tomcat의 기본 스레드 풀 설정(최대 200개 스레드)
   - 이 스레드 풀은 요청 처리를 위한 것이며, 개발자가 직접 제어하거나 사용하기 어렵습니다.
   - 주로 HTTP 요청 처리를 위해 자동으로 관리됩니다.

### ThreadPoolTaskExecutor의 역할

1. **별도의 작업 처리용 스레드 풀**:
   - ThreadPoolTaskExecutor는 서블릿 컨테이너의 스레드 풀과는 별개의 **추가적인 스레드 풀**입니다.
   - 개발자가 직접 생성하고 관리할 수 있습니다.
   - HTTP 요청 처리 외에 별도로 비동기 작업을 수행하기 위한 용도입니다.
2. **사용 목적**:
   - 장시간 실행되는 작업을 위임
   - CPU 집약적인 작업
   - I/O 대기 시간이 긴 작업(파일 처리, 외부 API 호출 등)
   - 메인 요청 처리 스레드를 차단하지 않고 병렬 작업 수행

### 실제 차이점과 관계

1. **요청 처리 vs 백그라운드 작업**:
   - 서블릿 컨테이너 스레드 풀: 주로 클라이언트 HTTP 요청을 처리
   - ThreadPoolTaskExecutor: 백그라운드 작업, 비동기 처리, 배치 작업 등을 위한 별도의 스레드 풀
2. **동작 예시**:

   ```
   클라이언트 요청 → 서블릿 컨테이너 스레드 할당 → 컨트롤러 처리
     → ThreadPoolTaskExecutor에 작업 위임 → 서블릿 스레드는 즉시 반환
     → ThreadPoolTaskExecutor가 백그라운드에서 작업 계속 처리
   ```

3. **구체적인 예시**:
   - 사용자가 파일 업로드 요청을 보냄
   - 서블릿 스레드가 요청을 받고 파일을 임시 저장
   - 파일 처리 작업은 ThreadPoolTaskExecutor에 위임 (비동기 처리)
   - 서블릿 스레드는 "처리 시작되었습니다" 응답 반환 후 다른 요청 처리 가능
   - ThreadPoolTaskExecutor는 백그라운드에서 파일 처리 작업 계속 수행

## ThreadPoolTaskExecutor 이해하기

ThreadPoolTaskExecutor와 Graceful Shutdown은 밀접한 관련이 있습니다. 애플리케이션이 종료될 때 ThreadPoolTaskExecutor에서 처리 중이던 작업들을 적절히 완료하는 것이 Graceful Shutdown의 중요한 부분입니다.

### 주요 특징

1. **스프링 통합**
   - Spring의 TaskExecutor 인터페이스 구현체로, Spring 환경에서 사용하기 적합
   - Bean으로 등록하여 의존성 주입 가능
   - @Async 어노테이션과 함께 사용하여 비동기 처리 구현
2. **쓰레드 풀 설정 옵션**
   - **corePoolSize**: 기본적으로 유지되는 쓰레드 수 (기본값: 1)
   - **maxPoolSize**: 최대 생성 가능한 쓰레드 수 (기본값: Integer.MAX_VALUE)
   - **queueCapacity**: 작업 대기열의 크기 (기본값: Integer.MAX_VALUE)
   - **keepAliveSeconds**: 코어 쓰레드 외 추가 쓰레드의 유지 시간
   - **threadNamePrefix**: 생성되는 쓰레드의 이름 접두사

### ThreadPoolTaskExecutor 동작 원리

ThreadPoolTaskExecutor의 작업 처리 흐름은 다음과 같습니다:

1. 새로운 작업이 제출되면 먼저 코어 쓰레드(corePoolSize)를 사용하여 처리합니다.
2. 모든 코어 쓰레드가 사용 중이면, 작업은 큐(LinkedBlockingQueue)에 추가됩니다.
3. 큐가 가득 차면(queueCapacity에 도달), 추가 쓰레드를 생성합니다(최대 maxPoolSize까지).
4. 모든 쓰레드가 사용 중이고 큐도 가득 찬 경우 RejectedExecutionHandler 정책에 따라 처리됩니다.

이 동작 방식을 이해하는 것은 적절한 설정을 위해 중요합니다. 예를 들어, corePoolSize가 10이고 queueCapacity가 100이라면, 11번째부터 110번째 작업은 큐에 쌓이고, 111번째 작업부터 추가 쓰레드(maxPoolSize까지)가 생성됩니다.

### RejectedExecutionHandler 정책

ThreadPoolTaskExecutor가 더 이상 작업을 처리할 수 없을 때(모든 쓰레드가 사용 중이고 큐도 가득 찬 상태) 어떻게 동작할지 결정하는 정책입니다:

1. **ThreadPoolExecutor.AbortPolicy** (기본값)
   - 추가 작업이 들어오면 RejectedExecutionException을 발생시킵니다.
   - 장점: 빠른 실패, 명확한 에러
   - 단점 : 작업이 손실, 클라이언트 에러 처리 필요
2. **ThreadPoolExecutor.CallerRunsPolicy**
   - 작업을 요청한 쓰레드(호출자)에서 직접 작업을 실행합니다.
   - 이는 일종의 백프레셔(backpressure) 효과를 제공하여 시스템이 과부하되는 것을 방지합니다.
   - 장점 : 작업 손실 없음, 자연스러운 백프레셔
   - 단점: 호출 스레드 차단, 일시적 성능 저하
3. **ThreadPoolExecutor.DiscardPolicy**
   - 추가 작업을 단순히 무시합니다.
   - 모든 작업이 반드시 처리될 필요가 없는 경우에만 사용해야 합니다.
   - 장점 : 오버헤드없음
   - 단점 : 작업 손실, 추적 어려움
4. **ThreadPoolExecutor.DiscardOldestPolicy**
   - 큐에서 가장 오래된 작업을 제거하고 새 작업을 추가합니다.
   - 역시 모든 작업이 반드시 처리될 필요가 없는 경우에만 사용해야 합니다.
   - 장점 : 최신 작업 우선 처리
   - 단점 : 작업 손실

모든 작업을 안전하게 처리해야 하는 상황에서는 CallerRunsPolicy를 사용하는 것이 일반적으로 권장됩니다.

## ThreadPoolTaskExecutor와 Graceful Shutdown의 관계

ThreadPoolTaskExecutor와 Graceful Shutdown은 매우 밀접한 관련이 있습니다. 애플리케이션이 종료될 때 ThreadPoolTaskExecutor에서 처리 중이던 작업들을 적절히 완료하는 것이 Graceful Shutdown의 중요한 부분입니다.

### Graceful Shutdown을 위한 ThreadPoolTaskExecutor 설정

ThreadPoolTaskExecutor는 다음과 같은 설정 옵션을 통해 Graceful Shutdown을 지원합니다:

1. **setWaitForTasksToCompleteOnShutdown(boolean)**
   - `true`로 설정하면, 애플리케이션 종료 시 큐에 남아있는 모든 작업이 완료될 때까지 기다립니다.
   - 기본값은 `false`로, 이 경우 애플리케이션 종료 시 즉시 쓰레드 풀을 종료합니다.
2. **setAwaitTerminationSeconds(int)**
   - 작업 완료를 기다리는 최대 시간(초)을 설정합니다.
   - 설정된 시간이 지나면 미완료 작업과 관계없이 쓰레드 풀을 종료합니다.
   - setWaitForTasksToCompleteOnShutdown이 true일 때만 의미가 있습니다.

이러한 설정을 통해 애플리케이션이 종료될 때 처리 중인 작업이나 큐에 대기 중인 작업들이 적절히 완료될 수 있도록 보장할 수 있습니다.

### ThreadPoolTaskExecutor 구성 예시

```java
@Configuration
public class AsyncConfig {

    private static final int CORE_POOL_SIZE = 10;
    private static final int MAX_POOL_SIZE = 30;
    private static final int QUEUE_CAPACITY = 100;
    private static final String THREAD_NAME_PREFIX = "MyAsync-";
    private static final boolean WAIT_FOR_TASKS = true;
    private static final int AWAIT_TERMINATION_SECONDS = 60;

    @Bean(name = "taskExecutor")
    public Executor taskExecutor() {
        ThreadPoolTaskExecutor taskExecutor = new ThreadPoolTaskExecutor();

        // 기본 쓰레드 풀 설정
        taskExecutor.setCorePoolSize(CORE_POOL_SIZE);
        taskExecutor.setMaxPoolSize(MAX_POOL_SIZE);
        taskExecutor.setQueueCapacity(QUEUE_CAPACITY);
        taskExecutor.setThreadNamePrefix(THREAD_NAME_PREFIX);

        // 거부 정책 설정 (백프레셔 효과를 위해 CallerRunsPolicy 사용)
        taskExecutor.setRejectedExecutionHandler(new ThreadPoolExecutor.CallerRunsPolicy());

        // Graceful Shutdown 설정
        taskExecutor.setWaitForTasksToCompleteOnShutdown(WAIT_FOR_TASKS);
        taskExecutor.setAwaitTerminationSeconds(AWAIT_TERMINATION_SECONDS);

        taskExecutor.initialize();
        return executor;
    }
}
```

이 설정은 다음과 같은 특성을 갖습니다:

- 기본적으로 10개의 쓰레드로 작업 처리
- 최대 30개까지 쓰레드 확장 가능
- 100개의 작업을 큐에 저장 가능
- 큐가 가득 차면 호출자 쓰레드에서 작업 실행 (CallerRunsPolicy)
- 애플리케이션 종료 시 모든 작업이 완료될 때까지 대기 (최대 60초)

## ThreadPoolTaskExecutor 사용 방법

ThreadPoolTaskExecutor를 다양한 방식으로 활용할 수 있습니다:

### 1. Executor의 execute() 메소드 사용

```java
 @Service
public class AsyncService {

    private final Executor executor;

    public AsyncService(@Qualifier("taskExecutor") Executor executor) {
        this.executor = executor;
    }

    public void processItems(List<Item> items) {
        for (Item item : items) {
            executor.execute(() -> {
                // 비동기 작업 처리
                processItem(item);
            });
        }
    }

    private void processItem(Item item) {
        // 실제 처리 로직
    }
}

```

### 특징:

- **가장 기본적인 방식**: Java 표준 Executor 인터페이스의 메소드 사용
- **반환값 없음**: `void` 반환 타입(Runnable 기반)으로 작업 결과를 직접 받을 수 없음
- **수동 에러 처리**: 작업 내에서 예외 처리를 직접 구현해야 함
- **수동 생명주기 관리**: 작업 실행 상태 추적이 필요하면 직접 구현해야 함

### 언제 사용하면 좋은가:

- 단순한 백그라운드 작업(결과 반환 필요 없음)
- "fire and forget" 스타일의 처리가 필요할 때
- 세밀한 제어가 필요한 경우
- ex) 단순 로그 기록 작업 같은 경우

### 2. CompletableFuture와 함께 사용

```java
@Service
public class AsyncService {

    private final Executor executor;

    public AsyncService(@Qualifier("taskExecutor") Executor executor) {
        this.executor = executor;
    }

    public CompletableFuture<List<Result>> processItemsAsync(List<Item> items) {
        List<CompletableFuture<Result>> futures = items.stream()
            .map(item -> CompletableFuture.supplyAsync(() -> processItem(item), executor))
            .collect(Collectors.toList());

        return CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]))
            .thenApply(v -> futures.stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList()));
    }

    private Result processItem(Item item) {
        // 실제 처리 로직
        return new Result(item.getId(), "Processed");
    }
}

```

### 특징:

- **결과 반환**: 작업의 결과를 CompletableFuture를 통해 받을 수 있음
- **조합 가능**: `thenApply`, `thenCompose`, `thenCombine` 등을 통해 비동기 작업들을 조합 가능
- **체인 처리**: 여러 작업을 연결해서 파이프라인으로 처리 가능
- **예외 처리**: `exceptionally`, `handle` 등을 통해 세밀한 예외 처리 가능
- **다양한 완료 처리**: `whenComplete`, `thenAccept` 등을 통한 완료 후 처리

### 언제 사용하면 좋은가:

- 작업 결과를 받아서 처리해야 할 때
- 여러 비동기 작업의 조합이 필요할 때
- 작업 간 의존성이 있을 때
- 세밀한 예외 처리가 필요할 때
- 작업 완료 여부를 확인해야 할 때
- ex) 여러 API 호출 결과를 조합해야 하는 경우

### 3. @Async 어노테이션과 함께 사용

```java
@Service
public class AsyncService {
    // ThreadPoolTaskExecutor의 Bean 이름을 @Async 어노테이션에 지정
    @Async("taskExecutor")
    public CompletableFuture<Result> processItemAsync(Item item) {
        // 비동기로 처리될 로직
        Result result = processItem(item);
        return CompletableFuture.completedFuture(result);
    }

    private Result processItem(Item item) {
        // 실제 처리 로직
        return new Result(item.getId(), "Processed");
    }
}

```

@Async를 사용하려면 @EnableAsync 어노테이션을 설정 클래스에 추가해야 합니다:

```java
@Configuration
@EnableAsync
public class AsyncConfig {
    // ThreadPoolTaskExecutor 구성...
}

```

### 특징:

- **선언적 방식**: 메소드에 어노테이션만 추가하면 됨
- **스프링 AOP 기반**: 프록시를 통해 메소드 호출이 비동기로 처리됨
- **단순한 코드**: 비동기 작업 처리를 위한 추가 코드가 거의 없음
- **메소드 레벨 적용**: 클래스 내 일부 메소드만 비동기로 처리 가능
- **컨텍스트 유지**: 스프링의 트랜잭션, 보안 컨텍스트 등이 전파될 수 있음

### 언제 사용하면 좋은가:

- 간단하게 비동기 처리를 적용하고 싶을 때
- 기존 코드를 최소한으로 변경하고 싶을 때
- 스프링 기능(트랜잭션 등)과 함께 사용할 때
- 컴포넌트 간 결합도를 낮추고 싶을 때
- ex) 이메일 발송 같은 백그라운드 작업

## ThreadPoolTaskExecutor 성능 최적화 팁

1. **적절한 corePoolSize 설정**
   - 일반적인 공식: CPU 코어 수 \* (1 + 대기 시간/CPU 시간)
   - I/O 바운드 작업: 코어 수보다 더 많은 쓰레드 설정 가능 (예: 코어 수 \* 2)
   - CPU 바운드 작업: 코어 수에 가깝게 설정 (예: 코어 수 + 1)
2. **queueCapacity 최적화**
   - 너무 작으면: 불필요하게 추가 쓰레드가 생성됨
   - 너무 크면: 메모리 사용량이 증가하고 작업 지연 가능성
   - 일반적으로 예상되는 최대 동시 요청 수의 2~3배로 설정
3. **작업 분할 고려**
   - 큰 작업은 작은 단위로 분할하여 처리 효율성 향상
   - 작업 간 의존성을 고려하여 CompletableFuture의 thenCompose, thenCombine 등 활용
4. **모니터링 구현**
   - 주기적으로 쓰레드 풀 상태(활성 쓰레드 수, 큐 크기 등) 모니터링
   - 문제 감지 시 알림 또는 자동 조정 메커니즘 구현

## 결론

ThreadPoolTaskExecutor와 Graceful Shutdown은 안정적인 Spring 애플리케이션 운영을 위한 중요한 요소입니다. ThreadPoolTaskExecutor를 통해 효율적인 비동기 작업 처리가 가능하며, Graceful Shutdown 설정을 통해 애플리케이션 종료 시 데이터 손실 없이 안전하게 종료할 수 있습니다.

적절한 쓰레드 풀 설정과 Graceful Shutdown 구성은 애플리케이션의 성능과 안정성을 크게, 향상시킬 수 있으므로, 프로덕션 환경에서 운영하는 Spring 애플리케이션에는 반드시 고려해야 할 요소입니다.

백프레셔 ??? CallerRunsPolicy ???

### 백프레셔(Backpressure)란?

백프레셔는 데이터 처리 시스템에서 하위 시스템이 처리할 수 있는 속도보다 상위 시스템이 데이터를 더 빠르게 생성할 때, 이를 제어하는 메커니즘입니다.

쉽게 설명하면:

- 마치 수도관에서 물이 너무 빨리 흐를 때 일부 압력을 거꾸로 돌려보내 흐름을 조절하는 것과 유사합니다.
- 시스템이 과부하되지 않도록 요청의 흐름을 조절합니다.

## CallerRunsPolicy 작동 방식 상세 설명

`CallerRunsPolicy`가 활성화되는 시나리오를 단계별로 살펴보겠습니다:

1. **정상 상황**:
   - HTTP 요청이 들어오면 서블릿 컨테이너(Tomcat 등)가 요청 처리용 스레드를 할당합니다.
   - 이 스레드가 컨트롤러 메소드를 실행하고, 그 안에서 `executor.execute(task)`와 같이 ThreadPoolTaskExecutor에 작업을 위임합니다.
   - 작업은 ThreadPoolTaskExecutor의 스레드 풀에서 비동기적으로 처리됩니다.
   - 서블릿 스레드는 즉시 응답을 반환하고 다음 요청을 처리할 수 있습니다.
2. **과부하 상황 (ThreadPoolTaskExecutor가 가득 찬 경우)**:
   - 모든 작업자 스레드가 사용 중이고 작업 큐도 가득 찬 상태입니다.
   - 이때 `executor.execute(task)`가 호출되면 `CallerRunsPolicy`가 활성화됩니다.
   - **중요 포인트**: 이 경우 작업은 "호출 스레드", 즉 서블릿 컨테이너의 요청 처리 스레드에서 직접 실행됩니다.
   - 이는 사실상 **동기 처리**로 전환되는 것입니다.

**ThreadPoolTaskExecutor 설정에 Graceful Shutdown 옵션 추가**

```java
@Bean
public ThreadPoolTaskExecutor taskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    // 기본 설정들 (corePoolSize, maxPoolSize 등)
    executor.setCorePoolSize(10);
    executor.setMaxPoolSize(20);
    executor.setQueueCapacity(100);

    // Graceful Shutdown 관련 설정
    executor.setWaitForTasksToCompleteOnShutdown(true); // 진행 중인 작업 완료 대기
    executor.setAwaitTerminationSeconds(60); // 최대 60초간 대기

    return executor;
}
```

Spring Boot 애플리케이션의 경우 application.properties나 application.yml에 설정 추가

```java
server.shutdown=graceful
spring.lifecycle.timeout-per-shutdown-phase=30s
```

**컨테이너 환경(Docker, Kubernetes)에서는 적절한 설정 추가**

- Docker에서는 SIGTERM 시그널을 보내고 일정 시간 대기하도록 설정
- Kubernetes에서는 terminationGracePeriodSeconds 설정 (보통 30초 이상으로 설정)
